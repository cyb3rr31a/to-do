import { test, expect } from '@playwright/test';

test.describe('TaskFlow Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the app title and header', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByText('Organize your day, achieve your goals')).toBeVisible();
    
    // Check stats cards
    await expect(page.getByText('Total')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('Today')).toBeVisible();
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
    
    // Verify todo appears in the list
    await expect(page.getByText('Buy groceries')).toBeVisible();
    
    // Verify stats are updated
    await expect(page.locator('[data-testid="total-count"]').or(page.getByText('1').first())).toBeVisible();
  });

  test('should add a todo with full details', async ({ page }) => {
    await page.goto('/');
    
    // Click on input to expand form
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();
    
    // Fill in all details
    await todoInput.fill('Complete project presentation');
    await page.getByPlaceholder('Add more details...').fill('Prepare slides and practice presentation for Monday meeting');
    
    // Set priority to high
    await page.getByRole('combobox').first().click();
    await page.getByText('● High').click();
    
    // Set category to work
    await page.getByRole('combobox').nth(1).click();
    await page.getByText('💼 Work').click();
    
    // Set due date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.getByLabel('Due Date').fill(dateString);
    
    // Submit the form
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Verify todo appears with all details
    await expect(page.getByText('Complete project presentation')).toBeVisible();
    await expect(page.getByText('Prepare slides and practice presentation for Monday meeting')).toBeVisible();
    await expect(page.getByText('high')).toBeVisible();
    await expect(page.getByText('💼 work')).toBeVisible();
  });

  test('should complete and uncomplete todos', async ({ page }) => {
    await page.goto('/');
    
    // Add a todo
    await page.getByPlaceholder('What needs to be done?').fill('Test task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Complete the todo
    await page.getByRole('checkbox').check();
    
    // Verify todo is marked as completed
    await expect(page.locator('text=Test task').first()).toHaveClass(/line-through/);
    
    // Verify completed stats updated
    await expect(page.getByText('1').nth(1)).toBeVisible(); // Done count
    
    // Uncomplete the todo
    await page.getByRole('checkbox').uncheck();
    
    // Verify todo is no longer completed
    await expect(page.locator('text=Test task').first()).not.toHaveClass(/line-through/);
  });

  test('should delete todos', async ({ page }) => {
    await page.goto('/');
    
    // Add a todo
    await page.getByPlaceholder('What needs to be done?').fill('Task to delete');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Delete the todo
    await page.getByRole('button').filter({ hasText: /trash/i }).or(page.locator('[data-testid="delete-button"]')).first().click();
    
    // Verify todo is removed
    await expect(page.getByText('Task to delete')).not.toBeVisible();
    await expect(page.getByText('Welcome to TaskFlow!')).toBeVisible();
  });

  test('should filter todos correctly', async ({ page }) => {
    await page.goto('/');
    
    // Add multiple todos
    await page.getByPlaceholder('What needs to be done?').fill('Active task 1');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    await page.getByPlaceholder('What needs to be done?').fill('Active task 2');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    await page.getByPlaceholder('What needs to be done?').fill('Task to complete');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Complete one task
    await page.getByRole('checkbox').first().check();
    
    // Test Active filter
    await page.getByRole('button', { name: /Active/ }).click();
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
    await expect(page.getByText('Task to complete')).not.toBeVisible();
    
    // Test Completed filter
    await page.getByRole('button', { name: /Completed/ }).click();
    await expect(page.getByText('Task to complete')).toBeVisible();
    await expect(page.getByText('Active task 1')).not.toBeVisible();
    await expect(page.getByText('Active task 2')).not.toBeVisible();
    
    // Test All filter
    await page.getByRole('button', { name: /All/ }).click();
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
    }
    
    // Complete first two tasks
    const checkboxes = page.getByRole('checkbox');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    
    // Clear completed tasks
    await page.getByRole('button', { name: /Clear Completed/ }).click();
    
    // Verify only active task remains
    await expect(page.getByText('Task 1')).not.toBeVisible();
    await expect(page.getByText('Task 2')).not.toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
  });

  test('should persist todos in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Add a todo
    await page.getByPlaceholder('What needs to be done?').fill('Persistent task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Reload the page
    await page.reload();
    
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
    }
    
    // Complete 2 tasks
    await page.getByRole('checkbox').nth(0).check();
    await page.getByRole('checkbox').nth(1).check();
    
    // Check stats
    const statsCards = page.locator('.grid').first();
    await expect(statsCards.getByText('4')).toBeVisible(); // Total
    await expect(statsCards.getByText('2')).toBeVisible(); // Done
    await expect(statsCards.getByText('2')).toBeVisible(); // Active
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
    
    // Look for toast notification (sonner toast)
    await expect(page.locator('[data-sonner-toast]').or(page.getByText('Task added successfully!'))).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify app loads and is usable on mobile
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    
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
    
    // Set due date to today
    const today = new Date().toISOString().split('T')[0];
    await page.getByLabel('Due Date').fill(today);
    
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Verify due date appears
    await expect(page.getByText('Due today')).toBeVisible();
  });
});