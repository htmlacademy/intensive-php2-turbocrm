<?php


namespace common\services;


interface AuthClient
{
    public function __construct($credentials_path, $token_path, $scope, $redirectUrl);

    public function setToken($path);

    public function isTokenExpired();

    public function isTokexExists();

    public function fetchAccessTokenByCode($code);

    public function storeToken($token);

    public function prepareClient();

    public function getAuthUrl();

    public function getVendorClient();

}
