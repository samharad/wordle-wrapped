#!/bin/bash

# Set the URL to fetch Wordle history
URL="https://screenrant.com/wordle-history/"

# Create a temporary file to store the HTML content
TEMP_HTML=$(mktemp /tmp/wordle_history_XXXXXX.html)

# Fetch the website content
echo "Fetching website content..."
curl -s "$URL" -o "$TEMP_HTML"

# Check if curl was successful
if [[ $? -ne 0 ]]; then
    echo "Failed to fetch the webpage. Exiting..."
    exit 1
fi

echo "Website content downloaded to $TEMP_HTML"

# Extract Wordle data using pup
# Example extraction: Look for elements that typically contain the Wordle answers in a table or list
echo "Extracting Wordle answers..."
pup 'table td text{}' < "$TEMP_HTML" > extracted_data.txt

OUT=puzzles.txt

# Post-process the extracted data (if necessary)
echo "Post-processing extracted data..."
awk 'NR%3==1 {date=$0} NR%3==2 {puzzle=$0} NR%3==0 {answer=$0; print date, puzzle, answer}' extracted_data.txt > $OUT

sed -i '' '/^[[:space:]]*$/d' $OUT
awk '{gsub(/^[ \t]+|[ \t]+$/, ""); print}' $OUT > $OUT.tmp && mv $OUT.tmp $OUT 
paste -d ',' - - - < $OUT > $OUT.tmp && mv $OUT.tmp $OUT

echo "Cleaned Wordle answers saved to $OUT"

# Cleanup
rm "$TEMP_HTML" extracted_data.txt

echo "Temporary files cleaned up. Done!"



# Input CSV file
INPUT_CSV=$OUT

# Output JavaScript file
OUTPUT_JS="src/wordlePuzzles.js"
# Check if input file exists
if [[ ! -f "$INPUT_CSV" ]]; then
    echo "Error: Input CSV file '$INPUT_CSV' not found."
    exit 1
fi

# Start writing the JavaScript file
echo "Generating JavaScript file '$OUTPUT_JS'..."
echo "// Wordle Puzzles Indexed by Puzzle Number" > "$OUTPUT_JS"
echo "const wordlePuzzles = {" >> "$OUTPUT_JS"

# Process the CSV and append to the JS file
awk -F',' '{
    # Trim leading/trailing spaces
    gsub(/^[ \t]+|[ \t]+$/, "", $1);
    gsub(/^[ \t]+|[ \t]+$/, "", $2);
    gsub(/^[ \t]+|[ \t]+$/, "", $3);

    # Remove the leading "#" in puzzle number for clean indexing
    puzzle_num = substr($2, 2);

    # Print the JavaScript key-value pair as an object
    print "  " puzzle_num ": { number: " puzzle_num ", date: \"" $1 "\", word: \"" $3 "\" },"
}' "$INPUT_CSV" >> "$OUTPUT_JS"

# Close the JavaScript object
echo "};" >> "$OUTPUT_JS"

# Export the object
echo "export default wordlePuzzles;" >> "$OUTPUT_JS"

echo "JavaScript file '$OUTPUT_JS' generated successfully!"
