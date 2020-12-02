<?php
namespace frontend\models;
use yii\data\ActiveDataProvider;
use yii\db\ActiveRecord;

class Company extends ActiveRecord
{
    use SoftDelete;

    public $search;

    public function search($params)
    {
        $query = self::find();
        $dataProvider = new ActiveDataProvider(['query' => $query]);

        if ($params) {
            $this->load($params);

            if ($this->search) {
                $query->orWhere(['like', 'email', $this->search]);
                $query->orWhere(['like', 'name', $this->search]);
                $query->orWhere(['like', 'phone', $this->search]);
            }
        }

        return $dataProvider;
    }

    public static function tableName()
    {
        return "company";
    }

    public function attributeLabels()
    {
        return [
            'name' => 'Имя',
            'address' => 'Адрес',
            'email' => 'Рабочий email',
            'phone' => 'Рабочий телефон',
            'url' => 'Сайт',
            'ogrn' => 'ОГРН'
        ];
    }

    public function rules()
    {
        return [
            [['name', 'phone', 'email', 'address', 'url', 'search'], 'safe'],
            [['name', 'phone', 'email', 'address', 'url'], 'required', 'on' => 'insert'],
            [['name', 'phone', 'email'], 'required', 'on' => 'update'],
            [['phone', 'email', 'url'], 'unique'],
            ['phone', 'string', 'length' => 11],
            ['email', 'email']
        ];
    }

    public function getContacts() {
        return $this->hasMany(Contact::class, ['company_id' => 'id'])->inverseOf('company');
    }

    public function getActiveContacts() {
        return $this->getContacts()->where(['status' => '1'])->orderBy(['dt_add' => SORT_ASC]);
    }
}
