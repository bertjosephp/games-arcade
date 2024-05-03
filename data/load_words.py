def read_words_from_file(filepath):
    words = []
    with open(filepath, 'r') as file:
        for line in file:
            words.append(line.strip())
    return words

def write_words_to_js(words, output_filepath):
    with open(output_filepath, 'w') as file:
        file.write("const listOfWords = [")
        for word in words:
            file.write(f'\"{word}\", ')
        file.write("];\n\n")
        file.write("export default listOfWords;")

filepath = './wordle-nyt-answers-alphabetical.txt'
output_filepath = 'words.js'

words = read_words_from_file(filepath)
write_words_to_js(words, output_filepath)