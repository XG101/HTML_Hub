#!/bin/bash

# Image names from JSON files
echo "Extracting image names from JSON files..."
grep -hoP '"[^"]+\.webp"' *recipes*json | tr -d '"' | sort | uniq > image_names_json.txt
echo "Saved image names from JSON to image_names_json.txt"

# Image files in the directory (or subdirectory, update path as needed)
echo "Listing actual image files..."
find /srv/csc351support/files/dataset/renamed_image_files -maxdepth 1 -type f -name "*.webp" -exec basename {} \; | sort | uniq > image_names_files.txt
echo "Saved image filenames to image_names_files.txt"

cp image_names_json.txt all_image_names_json.txt
cp image_names_files.txt all_image_names_files.txt

echo "Comparing lists..."

# Copy into arrays
mapfile -t json_refs < image_names_json.txt
mapfile -t file_names < image_names_files.txt

declare -A json_map
declare -A file_map

for img in "${json_refs[@]}"; do
    json_map["$img"]=1
done

for img in "${file_names[@]}"; do
    file_map["$img"]=1
done

# Find JSON names not in files
missing_files=()
for img in "${json_refs[@]}"; do
    if [[ -z "${file_map[$img]}" ]]; then
        missing_files+=("$img")
    fi
done

# Find files not in JSON
unused_images=()
for img in "${file_names[@]}"; do
    if [[ -z "${json_map[$img]}" ]]; then
        unused_images+=("$img")
    fi
done

# Output mismatches
echo -e "Names in JSON only:"
missing_files=($(printf "%s\n" "${missing_files[@]}" | grep '_1'))

printf '%s\n' "${missing_files[@]}"

echo -e "Names in files only:"
unused_images=($(printf "%s\n" "${unused_images[@]}" | grep '_1'))
printf '%s\n' "${unused_images[@]}"




echo -e "Names in JSON only:"
echo ${#missing_files[@]}

echo -e "Names in files only:"
echo ${#unused_images[@]}

## Output CSV file
#output_csv="image_replacements.csv"
#echo "missing_from_json,available_file" > "$output_csv"

## Loop through each item in missing_files
#for missing in "${missing_files[@]}"; do
#    # Strip _1.webp from the name to get the base name
#    base_name="${missing%_1.webp}"
#
#    # Try to find a match in unused_images
#    for candidate in "${unused_images[@]}"; do
#        if [[ "$candidate" == *"$base_name"* ]]; then
#            # Strip _1.webp from candidate if present
#            clean_candidate="${candidate%_1.webp}"
#            echo "$base_name,$clean_candidate" >> "$output_csv"
#            break  # only use the first match
#        fi
#    done
#done

#echo "CSV written to $output_csv"

