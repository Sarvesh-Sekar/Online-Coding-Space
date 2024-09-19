import java.util.Scanner;

public class cs299 {

    public static void twoSum(int[] nums, int target) {
        boolean found = false; // Flag to check if a valid pair is found
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    // Print indices separated by space
                    System.out.println(i + " " + j);
                    found = true; // Set flag to indicate a pair is found
                    return; // Return after finding the first valid pair
                }
            }
        }
        if (!found) {
            // Print -1 if no valid pair is found
            System.out.println("-1");
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read size of the array
        int numsSize = scanner.nextInt();
        
        // Declare array based on the size
        int[] nums = new int[numsSize];
        
        // Read elements of the array
        for (int i = 0; i < numsSize; i++) {
            nums[i] = scanner.nextInt();
        }
        
        // Read the target value
        int target = scanner.nextInt();
        
        // Call twoSum function
        twoSum(nums, target);
        
        scanner.close();
    }
}
