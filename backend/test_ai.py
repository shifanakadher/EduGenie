from ai_service import generate_response


try:
    response = generate_response(
        "What is the largest ocean in the world? Answer in one short sentence."
    )

    print("\nGemini response:")
    print(response)

except Exception as error:
    print("\nGemini connection failed:")
    print(error)