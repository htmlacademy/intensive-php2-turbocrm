<?php

namespace frontend\modules\api\controllers;

use frontend\models\Contact;
use yii\rest\ActiveController;
use yii\web\Controller;

/**
 * Default controller for the `api` module
 */
class ContactsController extends ActiveController
{
    public $modelClass = Contact::class;
}
