<?php

namespace htmlacademy\utils;

use htmlacademy\exceptions\FileFormatException;
use htmlacademy\exceptions\SourceFileException;
use SplFileObject;
use RuntimeException;

class ContactsImporter
{
    private  $filename;
    private  $columns;
    private  $fileObject;

    private $result = [];
    private $error = null;

    /**
     * ContactsImporter constructor.
     * @param $filename
     * @param $columns
     */
    public function __construct(string $filename, array $columns)
    {
        $this->filename = $filename;
        $this->columns = $columns;
    }

    public function import():void
    {
        if (!$this->validateColumns($this->columns)) {
            throw new FileFormatException("Заданы неверные заголовки столбцов");
        }

        if (!file_exists($this->filename)) {
            throw new SourceFileException("Файл не существует");
        }

        try {
            $this->fileObject = new SplFileObject($this->filename);
        }
        catch (RuntimeException $exception) {
            throw new SourceFileException("Не удалось открыть файл на чтение");
        }

        $header_data = $this->getHeaderData();

        if ($header_data !== $this->columns) {
            throw new FileFormatException("Исходный файл не содержит необходимых столбцов");
        }

        foreach ($this->getNextLine() as $line) {
            $this->result[] = $line;
        }
    }

    public function getData():array {
        return $this->result;
    }

    private function getHeaderData():?array {
        $this->fileObject->rewind();
        $data = $this->fileObject->fgetcsv();

        return $data;
    }

    private function getNextLine():?iterable {
        $result = null;

        while (!$this->fileObject->eof()) {
            yield $this->fileObject->fgetcsv();
        }

        return $result;
    }

    private function validateColumns(array $columns):bool
    {
        $result = true;

        if (count($columns)) {
            foreach ($columns as $column) {
                if (!is_string($column)) {
                    $result = false;
                }
            }
        }
        else {
            $result = false;
        }

        return $result;
    }
}
