<?php

namespace frontend\models;

use yii2tech\ar\softdelete\SoftDeleteBehavior;
use yii2tech\ar\softdelete\SoftDeleteQueryBehavior;

trait SoftDelete
{
    public function behaviors()
    {
        return [
            'softDeleteBahvior' => [
                'class' => SoftDeleteBehavior::class,
                'softDeleteAttributeValues' => ['deleted' => true]
            ]
        ];
    }

    public static function find()
    {
        $query = parent::find();
        $query->attachBehavior('softDelete', SoftDeleteQueryBehavior::class);

        $query->notDeleted();

        return $query;
    }
}
