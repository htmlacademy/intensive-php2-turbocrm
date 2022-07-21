<?php
/**
 * @var $faker \Faker\Generator
 * @var $index integer
 */
return [
    'name' => $faker->company,
    'email' => $faker->email,
    'url' => $faker->url,
    'address' => $faker->address,
    'phone' => substr($faker->e164PhoneNumber, 1, 11)
];
