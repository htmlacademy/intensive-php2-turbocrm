<?php


namespace frontend\controllers;


use frontend\helpers\DashboardPresentation;

class DashboardController extends SecuredController
{

    public function actionIndex()
    {
        $presentationHelper = new DashboardPresentation();

        return $this->render('index', ['presentationHelper' => $presentationHelper]);
    }

}
