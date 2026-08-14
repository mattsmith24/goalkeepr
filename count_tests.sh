#!/bin/bash

found_tests=0
for tf in tests/*; do
	tc=$(grep '^test(' $tf | wc -l)
	echo "$tf: $tc"
	found_tests=$((found_tests + tc))
	echo "$found_tests"
done
for tf in $(find src -type f -name '*.test.ts' ); do
	tc=$(grep ' it(' $tf | wc -l)
	echo "$tf: $tc"
	found_tests=$((found_tests + tc))
	echo "$found_tests"
done

