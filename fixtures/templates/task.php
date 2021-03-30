<?php
/**
 * @var $faker \Faker\Generator
 * @var $index integer
 */
return [
    'description' => $faker->text(150),
    'executor_id' => rand(1, 5),
    'deal_id' => rand(1, 20),
    'due_date' => $faker->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
    'type_id' => rand(1, 5),
    'dt_add' => $faker->dateTimeBetween('now', '+1 months')->format('Y-m-d'),
];
