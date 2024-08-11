#include <stdio.h>

void twoSum(int* nums, int numsSize, int target) {
    int found = 0; // Flag to check if a valid pair is found
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                // Print indices separated by space
                printf("%d %d\n", i, j);
                found = 1; // Set flag to indicate a pair is found
                return; // Return after finding the first valid pair
            }
        }
    }
    if (!found) {
        // Print -1 if no valid pair is found
        printf("-1\n");
    }
}

int main() {
    int numsSize;
    // Read size of the array
    scanf("%d", &numsSize);
    
    // Declare array based on the size
    int nums[numsSize];
    
    // Read elements of the array
    for (int i = 0; i < numsSize; i++) {
        scanf("%d", &nums[i]);
    }
    
    int target;
    // Read the target value
    scanf("%d", &target);
    
    // Call twoSum function
    twoSum(nums, numsSize, target);
    
    return 0;
}
