package util

// Some helpers that i'd rather extract out

// Filters a generic slice by a given acceptance function
func FilterSlice[T any](s []T, acceptFunc func(T) bool) []T {

	outputSlice := make([]T, cap(s))

	for _, v := range s {
		if acceptFunc(v) {
			outputSlice = append(outputSlice, v)
		}
	}

	return outputSlice
}

// Returns how many elements of a slice pass a given acceptance function
func FilterCount[T any](slc []T, acceptFunc func(element T) bool) int {

	outputCount := 0

	for _, v := range slc {
		if acceptFunc(v) {
			outputCount = outputCount + 1
		}
	}

	return outputCount
}

// Calls an accumulator function on each element of s, and returns the sum
// Accumulator function takes an item of type T, and the previous accumulator count. Returns the new accumulator sum.
func AccumulateSlice[T any](slc []T, accFunc func(cur int, element *T) int) float64 {
	accSum := 0

	for _, elm := range slc {
		accSum = accFunc(accSum, &elm)
	}

	return float64(accSum)
}

// https://stackoverflow.com/a/57213476
func RemoveIndex[T any](s []T, index int) []T {
	ret := make([]T, 0)
	ret = append(ret, s[:index]...)
	return append(ret, s[index+1:]...)
}
