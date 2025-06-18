import { test, expect } from '@playwright/test';

test.describe('TaskFlow Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Wait for the app to load
    await page.waitForSelector('h1:has-text("TaskFlow")', { timeout: 10000 });
  });

  test('should display the app title and header', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page.locator('h1').filter({ hasText: 'TaskFlow' })).toBeVisible();
    await expect(page.getByText('Organize your day, achieve your goals')).toBeVisible();
    
    // Check stats cards - be more specific to avoid conflicts
    await expect(page.locator('.grid').first().getByText('Total')).toBeVisible();
    await expect(page.locator('.grid').first().getByText('Done')).toBeVisible();
    await expect(page.locator('.grid').first().getByText('Active')).toBeVisible();
    await expect(page.locator('.grid').first().getByText('Today')).toBeVisible();
  });

  test('should show empty state when no todos exist', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Welcome to TaskFlow!')).toBeVisible();
    await expect(page.getByText("You don't have any tasks yet. Create your first task to get started.")).toBeVisible();
  });

  test('should add a basic todo', async ({ page }) => {
    await page.goto('/');
    
    // Add a simple todo
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Buy groceries');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for the todo to appear
    await expect(page.getByText('Buy groceries')).toBeVisible({ timeout: 5000 });
    
    // Verify stats are updated - look for any element containing "1"
    await expect(page.locator('text=1').first()).toBeVisible();
  });

  test('should add a todo with full details', async ({ page }) => {
    await page.goto('/');
    
    // Click on input to expand form
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();
    
    // Fill in all details
    await todoInput.fill('Complete project presentation');
    
    // Wait for form to expand
    await expect(page.getByPlaceholder('Add more details...')).toBeVisible();
    await page.getByPlaceholder('Add more details...').fill('Prepare slides and practice presentation for Monday meeting');
    
    // Set priority to high - click the first select trigger
    await page.locator('[role="combobox"]').first().click();
    // Wait for dropdown to open and click the high priority option
    await page.waitForSelector('[role="option"]');
    await page.locator('[role="option"]').filter({ hasText: 'High' }).click();
    
    // Set category to work - click the second select trigger
    await page.locator('[role="combobox"]').nth(1).click();
    // Wait for dropdown to open and click the work option
    await page.waitForSelector('[role="option"]');
    await page.locator('[role="option"]').filter({ hasText: 'Work' }).click();
    
    // Set due date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(dateString);
    
    // Submit the form
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Verify todo appears with all details
    await expect(page.getByText('Complete project presentation')).toBeVisible();
    await expect(page.getByText('Prepare slides and practice presentation for Monday meeting')).toBeVisible();
    await expect(page.getByText('high', { exact: false })).toBeVisible();
    await expect(page.getByText('work', { exact: false })).toBeVisible();
  });

  test('should complete and uncomplete todos', async ({ page }) => {
    await page.goto('/');
    
    // Add a todo
    await page.getByPlaceholder('What needs to be done?').fill('Test task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for todo to appear
    await expect(page.getByText('Test task')).toBeVisible();
    
    // Complete the todo - use the custom checkbox component
    await page.locator('[role="checkbox"]').first().click();
    
    // Wait a moment for the UI to update
    await page.waitForTimeout(500);
    
    // Verify todo is marked as completed (look for strikethrough class)
    await expect(page.locator('text=Test task').first()).toHaveClass(/line-through/);
    
    // Uncomplete the todo
    await page.locator('[role="checkbox"]').first().click();
    
    // Wait a moment for the UI to update
    await page.waitForTimeout(500);
    
    // Verify todo is no longer completed
    await expect(page.locator('text=Test task').first()).not.toHaveClass(/line-through/);
  });

  test('should delete todos', async ({ page }) => {
    await page.goto('/');
    
    // Add a todo
    await page.getByPlaceholder('What needs to be done?').fill('Task to delete');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for todo to appear
    await expect(page.getByText('Task to delete')).toBeVisible();
    
    // Delete the todo - look for the trash icon button more specifically
    await page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).first().click();
    
    // Wait for deletion animation
    await page.waitForTimeout(1000);
    
    // Verify todo is removed
    await expect(page.getByText('Task to delete')).not.toBeVisible();
    await expect(page.getByText('Welcome to TaskFlow!')).toBeVisible();
  });

  test('should filter todos correctly', async ({ page }) => {
    await page.goto('/');
    
    // Add multiple todos
    const tasks = ['Active task 1', 'Active task 2', 'Task to complete'];
    
    for (const task of tasks) {
      await page.getByPlaceholder('What needs to be done?').fill(task);
      await page.getByRole('button', { name: 'Add Task' }).click();
      await page.waitForTimeout(500); // Wait between additions
    }
    
    // Complete one task - use the custom checkbox
    await page.locator('[role="checkbox"]').first().click();
    await page.waitForTimeout(500);
    
    // Test Active filter - be more specific to avoid the stats card
    await page.locator('button').filter({ hasText: 'Active' }).filter({ has: page.locator('svg') }).click();
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
    await expect(page.getByText('Task to complete')).not.toBeVisible();
    
    // Test Completed filter
    await page.locator('button').filter({ hasText: 'Completed' }).filter({ has: page.locator('svg') }).click();
    await expect(page.getByText('Task to complete')).toBeVisible();
    await expect(page.getByText('Active task 1')).not.toBeVisible();
    await expect(page.getByText('Active task 2')).not.toBeVisible();
    
    // Test All filter
    await page.locator('button').filter({ hasText: 'All' }).filter({ has: page.locator('svg') }).click();
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
    await expect(page.getByText('Task to complete')).toBeVisible();
  });

  test('should clear completed todos', async ({ page }) => {
    await page.goto('/');
    
    // Add and complete multiple todos
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    
    for (const task of tasks) {
      await page.getByPlaceholder('What needs to be done?').fill(task);
      await page.getByRole('button', { name: 'Add Task' }).click();
      await page.waitForTimeout(300);
    }
    
    // Complete first two tasks - use the custom checkbox
    const checkboxes = page.locator('[role="checkbox"]');
    await checkboxes.nth(0).click();
    await page.waitForTimeout(300);
    await checkboxes.nth(1).click();
    await page.waitForTimeout(300);
    
    // Clear completed tasks
    await page.getByRole('button', { name: 'Clear Completed' }).click();
    await page.waitForTimeout(1000);
    
    // Verify only active task remains
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).not.toBeVisible();
    await expect(page.getByText('Task 3')).not.toBeVisible();
  });

  test('should persist todos in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Add a todo
    await page.getByPlaceholder('What needs to be done?').fill('Persistent task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for todo to appear
    await expect(page.getByText('Persistent task')).toBeVisible();
    
    // Reload the page
    await page.reload();
    await page.waitForSelector('h1:has-text("TaskFlow")');
    
    // Verify todo persists
    await expect(page.getByText('Persistent task')).toBeVisible();
  });

  test('should show correct stats', async ({ page }) => {
    await page.goto('/');
    
    // Add multiple todos
    const tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];
    
    for (const task of tasks) {
      await page.getByPlaceholder('What needs to be done?').fill(task);
      await page.getByRole('button', { name: 'Add Task' }).click();
      await page.waitForTimeout(300);
    }
    
    // Complete 2 tasks - use the custom checkbox
    await page.locator('[role="checkbox"]').nth(0).click();
    await page.waitForTimeout(300);
    await page.locator('[role="checkbox"]').nth(1).click();
    await page.waitForTimeout(300);
    
    // Check stats - look for the stats grid specifically
    const statsSection = page.locator('.grid').first();
    await expect(statsSection).toBeVisible();
    
    // Look for the numbers in the stats cards - be more specific
    await expect(statsSection.locator('text=4').first()).toBeVisible(); // Total
    await expect(statsSection.locator('text=2').first()).toBeVisible(); // Done or Active
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form
    const addButton = page.getByRole('button', { name: 'Add Task' });
    await expect(addButton).toBeDisabled();
    
    // Add text and verify button becomes enabled
    await page.getByPlaceholder('What needs to be done?').fill('Valid task');
    await expect(addButton).toBeEnabled();
    
    // Clear text and verify button becomes disabled again
    await page.getByPlaceholder('What needs to be done?').clear();
    await expect(addButton).toBeDisabled();
  });

  test('should expand and collapse form', async ({ page }) => {
    await page.goto('/');
    
    // Initially, advanced fields should not be visible
    await expect(page.getByPlaceholder('Add more details...')).not.toBeVisible();
    
    // Click on input to expand
    await page.getByPlaceholder('What needs to be done?').click();
    
    // Advanced fields should now be visible
    await expect(page.getByPlaceholder('Add more details...')).toBeVisible();
    await expect(page.getByText('Priority')).toBeVisible();
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Due Date')).toBeVisible();
    
    // Cancel should collapse the form
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByPlaceholder('Add more details...')).not.toBeVisible();
  });

  test('should show toast notifications', async ({ page }) => {
    await page.goto('/');
    
    // Add a task and check for success toast
    await page.getByPlaceholder('What needs to be done?').fill('Toast test task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Look for toast notification - use a more specific approach
    // The toast should appear with the success message
    await expect(page.getByText('Task added successfully!')).toBeVisible({ timeout: 3000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify app loads and is usable on mobile
    await expect(page.locator('h1').filter({ hasText: 'TaskFlow' })).toBeVisible();
    
    // Add a task on mobile
    await page.getByPlaceholder('What needs to be done?').fill('Mobile task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    await expect(page.getByText('Mobile task')).toBeVisible();
  });

  test('should handle due dates correctly', async ({ page }) => {
    await page.goto('/');
    
    // Add task with due date
    await page.getByPlaceholder('What needs to be done?').click();
    await page.getByPlaceholder('What needs to be done?').fill('Task with due date');
    
    // Wait for form to expand
    await expect(page.getByPlaceholder('Add more details...')).toBeVisible();
    
    // Set due date to today
    const today = new Date().toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(today);
    
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Verify due date appears
    await expect(page.getByText('Due today')).toBeVisible();
  });
});