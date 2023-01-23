package util

import "testing"


func TestFilterCount(t *testing.T) {
	testIntSlice := []int{1, 2, 3, 4, 5}

	isOddPassFunc := func (element int) bool {
			return (element % 2 != 0);
	}


	filterCountRes := FilterCount(testIntSlice, isOddPassFunc)

	if filterCountRes != 3 {
		t.Error("result should be 3, got", filterCountRes)
	}

}