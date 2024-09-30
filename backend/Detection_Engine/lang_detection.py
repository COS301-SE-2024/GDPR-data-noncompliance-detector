import langid

class location_finder:
    
    def __init__(self):
        # List of EU languages using Langid ISO 639-1 codes
        self.eu_languages = {
            'bg',  # Bulgarian
            'cs',  # Czech
            'da',  # Danish
            'de',  # German
            'el',  # Greek
            'es',  # Spanish
            'et',  # Estonian
            'fi',  # Finnish
            'fr',  # French
            'ga',  # Irish
            'hr',  # Croatian
            'hu',  # Hungarian
            'it',  # Italian
            'lt',  # Lithuanian
            'lv',  # Latvian
            'mt',  # Maltese
            'nl',  # Dutch
            'pl',  # Polish
            'pt',  # Portuguese
            'ro',  # Romanian
            'sk',  # Slovak
            'sl',  # Slovenian
            'sv',  # Swedish
        }

    def detect_country(self, text):
        # Use Langid to classify the text language
        predicted_language, confidence = langid.classify(text)
        
        if predicted_language in self.eu_languages:
            return 0  # EU language
        
        elif predicted_language == 'en':  # English (special case)
            return 2  # Defined language (English)
        
        else:
            return 1  # Non-EU language

# Example usage
if __name__ == "__main__":
    location_finder = location_finder()
    
    # Sample text in different languages
    text_samples = [
        "Bonjour tout le monde",  # French (EU)
        "Hello, how are you?",  # English (defined)
        "Hola, ¿cómo estás?",  # Spanish (EU)
        "Привет, как дела?",  # Russian (non-EU)
    ]
    
    for text in text_samples:
        result = location_finder.detect_country(text)
        print(f"Text: {text}\nDetected location type: {result}\n")
