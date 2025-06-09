#!/bin/bash
set -e

BUCKET_NAME="${AWS_BUCKET_NAME:-babybabylog}"
PREFIX="tests/"
PATTERN="test-image"

echo "Cleaning up S3 objects in bucket: $BUCKET_NAME with prefix: $PREFIX or containing: $PATTERN"

aws s3 ls "s3://$BUCKET_NAME/" --recursive | awk '{print $4}' | while read file; do
  if [[ "$file" == $PREFIX* ]] || [[ "$file" == *$PATTERN* ]]; then
    echo "Deleting: s3://$BUCKET_NAME/$file"
    aws s3 rm "s3://$BUCKET_NAME/$file"
  fi
done

echo "S3 cleanup complete." 