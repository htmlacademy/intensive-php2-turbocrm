<?php


namespace frontend\interfaces;


interface PersonInterface
{

    /**
     * @return string
     */
    public function getPersonName();

    /**
     * @return string
     */
    public function getPersonPosition();

    /**
     * @return string
     */
    public function getPersonCompany();
}
