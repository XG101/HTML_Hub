#!/bin/bash

# Input CSV
csv="image_replacements.csv"

# Step 1: Read each row (skip header)
tail -n +2 "$csv" | while IFS=',' read -r old new; do
    echo "Replacing: $old → $new"
    
    # Step 2: Replace in all *recipes*json files
    for file in *recipes*json; do
        if grep -q "$old" "$file"; then
            sed -i "s/$old/$new/g" "$file"
            echo "Updated $file"
        fi
    done
done

echo "All replacements done."
