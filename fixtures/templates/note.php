<?php
/**
 * @var $faker \Faker\Generator
 * @var $index integer
 */
return [
    'content' => $faker->realText(100),
    'user_id' => rand(1, 5),
    'deal_id' => rand(1, 20)
];
