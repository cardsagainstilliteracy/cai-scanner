# cai-scanner
A tool that automates the creation of flashcard decks for [CAI](https://github.com/cardsagainstilliteracy).

## Overview
Creating the flashcard decks for CAI is very labor intensive.
For each vocabulary term, the creator must
1. Type the pinyin into Google Translate.
2. Copy the characters and paste it into the deck file.
3. Paste the characters into the textarea and copy the pinyin, pasting it into the deck file.
4. Type the English translation into the deck file.

This tool allows you to generate the deck file by merely taking a picture of the vocabulary sheet.

Under the hood, this works by:
1. Converting the image to text with [OCR.space](https://ocr.space/ocrapi).
2. Translating the text with Google Cloud Translate.
3. Generating pinyin with NPM's `nodejieba` and `pinyin` packages.

Of course, there will be errors you will need to manually correct.

## Installation
1. Run the following:
```bash
git clone https://github.com/cards-against-illiteracy/cai-scanner.git;
cd cai-scanner;
npm install;
```
2. Get an [ocr.space API key](https://ocr.space/ocrapi).
3. Create a Google Cloud Project and enable the Translation API.
4. Download an API key.
5. Create a `.env` file:
```
OCR_API_KEY=yourKeyHere
GOOGLE_PROJECT_ID=yourProjectIdHere
GOOGLE_APPLICATION_CREDENTIALS=pathToApiKeyJsonHere
```

## Usage
Take a picture of the vocabulary sheet.
Move it to the `images/` directory.
```bash
export IMAGE_PATH=imagePathRelativeToImagesDirectory;
npm run all;
```
Alternatively, if you want to run each step of the process individually (so you can make corrections):
```bash
npm run scan
# Make corrections to the resulting file, which can be found `./parseResults/$(IMAGE_PATH).txt`.

npm run translate
# Make corrections to the resulting file, which can be found `./translations/$(IMAGE_PATH).txt`.

npm run pinyin
# Make corrections to the resulting file, which can be found `./pinyin/$(IMAGE_PATH).txt`.

npm run segment
# Make corrections to the resulting file, which can be found `./decks/$(IMAGE_PATH).js`.

# Congrats! You're done.
```
The second way is recommended.
