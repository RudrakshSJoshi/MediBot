from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
import os
import faiss
import torch
import fitz
import json
import numpy as np
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer
import time

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Define the device
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# Initialize the SentenceTransformer model
print("Loading SentenceTransformer model...")
sentence_model = SentenceTransformer('Alibaba-NLP/gte-large-en-v1.5', trust_remote_code=True)
sentence_model.to(device)  # Move model to GPU if available

# Initialize the tokenizer
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained('Alibaba-NLP/gte-large-en-v1.5')

# Load the FAISS index
print("Loading FAISS index...")
index = faiss.read_index('med_vector_db/vector_index.faiss')

print("Loading metadata...")
with open('med_vector_db/metadata.json', 'r') as f:
    metadata = json.load(f)

def similarity_search(query, top_k=3):
    # Tokenize the query
    inputs = tokenizer(query, return_tensors="pt", padding=True, truncation=True)
    inputs = {key: value.to(device) for key, value in inputs.items()}  # Move inputs to GPU

    # Pass the inputs through the model to get embeddings
    with torch.no_grad():
        query_embedding = sentence_model.encode(query, convert_to_tensor=True)
        query_embedding = query_embedding.unsqueeze(0)  # Ensure it's a 2D array with shape (1, embedding_dim)
        query_embedding = query_embedding.to("cpu").numpy()  # Move embedding back to CPU for FAISS

    # Search the index for the top_k most similar vectors
    distances, indices = index.search(query_embedding, top_k)

    # Retrieve the corresponding chunks and their metadata
    results = []
    for i, idx in enumerate(indices[0]):
        # Fetch the chunk metadata
        chunk_metadata = metadata[idx]
        pdf_name = chunk_metadata["pdf_name"]
        pdf_page = chunk_metadata["pdf_page"]
        chunk_index = chunk_metadata["chunk_index"]
        result = {
            "chunk": {
                "pdf_name": pdf_name,
                "pdf_page": pdf_page,
                "chunk_index": chunk_index
            },
            "distance": distances[0][i]
        }
        results.append(result)

    return results

def extract_text_from_page(pdf_path, page_num):
    doc = fitz.open(pdf_path)
    text = doc[page_num].get_text()
    doc.close()
    return text

def generate_response(context, question, luq, lba):
    # Initialize the ChatGoogleGenerativeAI model
    google_model = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=GEMINI_API_KEY,
        temperature=0.6
    )

    PROMPT_TEMPLATE = f"""
1. Your description:
    1.1. You are MediBOT, a mdeical professional assistance bot that is designed to help users know everything about medical fields.
    1.2. You were created by Von.
    1.3. Von consists of two people, Rudraksh (email: rsjoshi0505@gmail.com) and Pratham(email: pratham2403@gmail.com)
    1.4. Von is an Icelandic term which stands for 'HOPE' and you were created to bring a smile on people's faces.
    1.5. You will share the emails if the user asks.
2. Your domains are:
    2.1. Gerontological Nursing
    2.2. Mental Disorders
    2.3. Internal Medicine
    2.4. Pediatric Diseases and Health Care
    2.5. Clinical Diagnosis and Treatment Guidelines
    2.6. First Aid and Emergency Management
    2.7. Human Nutrition
    2.8. Infectious Diseases
    2.9. Ethical and Legal Issues in Gerontology
    2.10. Global Models of Health Care
    2.11. Neurological Disorders
    2.12. Dermatologic Disorders
    2.13. Gynecologic and Obstetric Disorders
    2.14. Common Surgical Disorders
    2.15. Immunization Requirements
3. Your task is to answer people's queries based on the question and context provided.
4. You follow these instructions while answering questions:
    4.1. You will answer all questions that are medically relevant, and use the context for information to frame better answers.
    4.2. You will refrain from answering non-medical questions, except the ones that are related to you or your creators.
    4.3. Asuume that the context is always fetched by you, not the user.
    4.4. You will explain the reason for not answering questions, as it helps the user to understand your role.
5. Refrain from answering irrelevant questions, this includes:-
    5.1. Queries asking names, ages, or any personal question.
    5.2. Questions related to simple maths, which is not relevant to domain.
    5.3. Questions that do not lie in domain.
6. You explain terms in layman terms which makes it very easy for people to understand your responses.
7. You answer questions which lie in your domain, otherwise you do not answer the question, and simply explain the reason behind not answering.
8. You should refrain from answering sensitive and vulgar questions.
9. Your answers will include all the necessary information related to the user's current query, only if they belong to domain.
10. Refrain from answering queries which are not present in domain, and tell the reason why.
11. For basic queries, answer in a few words only, this includes:
    1.11.1. Hi, Hello, Hi there (any introductory greeting), you may responde with 'Hi there!' and add a sweet emoji.
    1.11.2. Thanks, Okay, Ohh (any gratitude or understading related basic query), you may respond with 'My pleasure!' and add a sweet emoji.
    1.11.3. Bye, See you, Okay then (any farewell related query), you may respond with 'Alrighty then! Bye Bye' and add a sweet emoji."""
    
    modified_query = f"""
1. Follow the prompt template: {PROMPT_TEMPLATE}.
2. Query: {question},
3. Context: {context},
4. User's Last Asked Query: {luq},
5. Your Answer On User's Last Query: {lba}

Now answer only user's current query, take help from last query to understand the question, if required."""
    messages = [
        {"role": "user", "content": context},
        {"role": "user", "content": modified_query}
    ]

    # Generate the response
    response = google_model.invoke(messages)

    return response.content

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/detect', methods=['POST'])
def detect():
    if request.content_type != 'application/json':
        return 'Unsupported Media Type', 415

    data = request.get_json()
    query_text = data.get('query', 'No query asked')
    last_user_query = data.get('last_user_query', "The user hasn't yet asked a question")
    last_bot_answer = data.get('last_bot_answer', "No answer, as user hasn't asked anything before")

    if not query_text:
        return jsonify({'response': 'OOPS, something went wrong'}), 400

    start_time = time.time()  # Record the start time

    try:
        updated_query = f"""Current query: {query_text}; Last query: {last_user_query}; Last answer: {last_bot_answer}"""
        # Perform similarity search to get the top k relevant chunks
        print(f"Performing similarity search for query: {updated_query}")
        results = similarity_search(updated_query, top_k=3)

        # Prepare the context from the search results
        context = ""
        visited_pages = set()  # To keep track of visited pages and avoid duplication

        for res in results:
            chunk = res["chunk"]
            pdf_name = chunk["pdf_name"]
            pdf_page = chunk["pdf_page"]
            page_key = (pdf_name, pdf_page)

            if page_key not in visited_pages:
                visited_pages.add(page_key)
                pdf_path = f"medical_data/{pdf_name}"
                page_text = extract_text_from_page(pdf_path, pdf_page)

                context += f"Document: {pdf_name}, Page: {pdf_page}\n"
                context += f"Text:\n{page_text}\n\n\n"

        print(f"Generated context: {context}")

        # Generate the response
        response = generate_response(context, query_text, last_user_query, last_bot_answer)
        print(f"Generated response: {response}")

        end_time = time.time()  # Record the end time
        elapsed_time = end_time - start_time  # Calculate elapsed time
        print(f"Time elapsed: {elapsed_time:.2f} seconds")

        if response:
            return jsonify({'response': response})
        else:
            return jsonify({'response': 'Response Not Generated...'})

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({'response': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
