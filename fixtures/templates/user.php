<?php
/**
 * @var $faker \Faker\Generator
 * @var $index integer
 */
return [
    'email' => $faker->email,
    'company' => $faker->company,
    'phone' => substr($faker->e164PhoneNumber, 1, 11),
    'password' => Yii::$app->getSecurity()->generatePasswordHash('password_' . $index),
    'name' => $faker->name,
    'position' => $faker->jobTitle
];
