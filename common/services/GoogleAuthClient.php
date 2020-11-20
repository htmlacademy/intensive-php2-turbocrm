<?php

namespace common\services;

use Google_Client;


class GoogleAuthClient implements AuthClient
{
    /**
     * @var Google_Client
     */
    protected $googleClient;

    protected $tokenPath;

    public function __construct($credentials_path, $token_path, $scope)
    {
        $client = new Google_Client();
        $client->setApplicationName("Google Auth");
        $client->setScopes($scope);
        $client->setAuthConfig($credentials_path);
        $client->setAccessType("offline");

        $this->googleClient = $client;

        $this->tokenPath = $token_path;
    }

    public function setToken($path)
    {
        if (file_exists($path)) {
            $accessToken = json_decode(file_get_contents($path), true);

            if ($accessToken) {
                $this->googleClient->setAccessToken($accessToken);
            }
        }
    }

    public function isTokenExpired()
    {
        return $this->googleClient->isAccessTokenExpired();
    }

    public function fetchAccessTokenByCode($code)
    {
        return $this->googleClient->fetchAccessTokenWithAuthCode($code);
    }

    public function storeToken($token)
    {
        if (!file_exists(dirname($this->tokenPath))) {
            mkdir(dirname($this->tokenPath), 0700, true);
        }

        file_put_contents($this->tokenPath, json_encode($token));
    }

    public function prepareClient()
    {
        $this->setToken($this->tokenPath);

        if ($this->isTokenExpired()) {
            if ($refresh = $this->googleClient->getRefreshToken()) {
                $access_token = $this->googleClient->fetchAccessTokenWithRefreshToken($refresh);
                $this->storeToken($access_token);

                return true;
            }

            return false;
        }

        return true;
    }

    public function getAuthUrl()
    {
        return $this->googleClient->createAuthUrl();
    }

    public function getVendorClient()
    {
        return $this->googleClient;
    }
}
