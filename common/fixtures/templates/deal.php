<?php
/**
 * @var $faker \Faker\Generator
 * @var $index integer
 */

return [
    'name' => $faker->sentence,
    'company_id' => rand(1, 10),
    'status_id' => rand(1, 4),
    'contact_id' => rand(1, 10),
    'executor_id' => rand(1, 5),
    'user_id' => rand(1, 5),
    'due_date' => $faker->dateTimeBetween('now', '+2 years')->format('Y-m-d'),
    'description' => $faker->paragraph(2),
    'budget_amount' => $faker->numberBetween(5000, 500000)
];
