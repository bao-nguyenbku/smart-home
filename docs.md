## GET ALL ROOM
```
GET http://localhost:5000/room/all
```
Example response:
``` json
{
    "data": [
        {
            "_id": "624281390ee4e33c6fffb543",
            "id": 202232910475,
            "name": "Kitchen",
            "createdAt": "2022-03-29T03:47:05.527Z",
            "updatedAt": "2022-03-29T03:47:05.527Z",
            "__v": 0
        },
        {
            "_id": "6242817bafae31267e86b6ab",
            "id": 2022329104811,
            "name": "Living room",
            "createdAt": "2022-03-29T03:48:11.493Z",
            "updatedAt": "2022-03-29T03:48:11.493Z",
            "__v": 0
        },
        {
            "_id": "6242d14069034d38f754f7c6",
            "id": 2022329162832,
            "name": "Toilet",
            "createdAt": "2022-03-29T09:28:32.148Z",
            "updatedAt": "2022-03-29T09:28:32.148Z",
            "__v": 0
        },
        {
            "_id": "62430f1044a66a5ce52aafc4",
            "id": 2022329205216,
            "name": "Garage",
            "createdAt": "2022-03-29T13:52:17.001Z",
            "updatedAt": "2022-03-29T13:52:17.001Z",
            "__v": 0
        },
        {
            "_id": "62451e5ca53d7dd1d85c28a8",
            "id": 202233110224,
            "name": "Bathroom",
            "createdAt": "2022-03-31T03:22:04.131Z",
            "updatedAt": "2022-03-31T03:22:04.131Z",
            "__v": 0
        }
    ]
}
```
## ADD NEW ROOM
```
Header: Content-Type: application/json
```
```json
POST http://localhost:5000/room/add
{
    "name": "DFSFSDame"
}
```
Example response:
``` json
{
    "status": 200,
    "data": {
        "id": 202241495334,
        "name": "DFSFSDame",
        "_id": "62578cae7dcdc13e3c157d6c",
        "createdAt": "2022-04-14T02:53:34.123Z",
        "updatedAt": "2022-04-14T02:53:34.123Z",
        "__v": 0
    }
}
```

## DELETE A ROOM
``` json
POST http://localhost:5000/room/delete
{
    "id": 202241410318
}
```

Example response:
``` json
{
    "status": 200,
    "data": {
        "_id": "62578ef6b1f290052bc5d01b",
        "id": 202241410318,
        "name": "New room",
        "createdAt": "2022-04-14T03:03:18.849Z",
        "updatedAt": "2022-04-14T03:03:18.849Z",
        "__v": 0
    }
}
```

## GET ALL DEVICES

```
GET http://localhost:5000/device/all
```
Example response:
```json
{
    "data": [
        {
            "_id": "6255311805fd070ba87eb217",
            "id": 2022412145816,
            "name": "Đèn bếp",
            "status": false,
            "type": "led",
            "roomId": 202232910475,
            "capacity": 36,
            "duration": 607362132,
            "lastUse": "2022-04-16T04:17:44.954Z",
            "createdAt": "2022-04-12T07:58:16.987Z",
            "updatedAt": "2022-04-16T04:23:55.977Z",
            "__v": 0
        },
        {
            "_id": "6255325804cc8b5a55baa2fe",
            "id": 202241215336,
            "name": "Đèn góc trái",
            "status": false,
            "type": "led",
            "roomId": 202232910475,
            "capacity": 36,
            "duration": 569665363,
            "lastUse": "2022-04-16T04:17:18.893Z",
            "createdAt": "2022-04-12T08:03:36.530Z",
            "updatedAt": "2022-04-16T04:17:21.097Z",
            "__v": 0
        }
    ]
}
```

## GET ALL DEVICE BY ROOM ID

```json
POST http://localhost:5000/room/device/all
{
    "id": 202232910475
}
```
Example response:

```json
{
    "data": [
        {
            "_id": "6255311805fd070ba87eb217",
            "id": 2022412145816,
            "name": "Đèn bếp",
            "status": false,
            "type": "led",
            "roomId": 202232910475,
            "capacity": 36,
            "duration": 607371365,
            "lastUse": "2022-04-16T08:13:33.338Z",
            "createdAt": "2022-04-12T07:58:16.987Z",
            "updatedAt": "2022-04-16T08:13:39.547Z",
            "__v": 0
        },
        {
            "_id": "6255325804cc8b5a55baa2fe",
            "id": 202241215336,
            "name": "Đèn góc trái",
            "status": false,
            "type": "led",
            "roomId": 202232910475,
            "capacity": 36,
            "duration": 569665363,
            "lastUse": "2022-04-16T04:17:18.893Z",
            "createdAt": "2022-04-12T08:03:36.530Z",
            "updatedAt": "2022-04-16T04:17:21.097Z",
            "__v": 0
        }
    ]
}
```
## ADD NEW DEVICE

```json
POST http://localhost:5000/device/add

{
    "name": "new device",
    "id": 452,
    "type": "led",
    "roomId": 322348042434
}
```

Example response:
```json
{
    "status": 200,
    "data": {
        "id": 452,
        "name": "new device",
        "status": false,
        "type": "led",
        "roomId": 322348042434,
        "capacity": 36,
        "duration": 0,
        "lastUse": "2022-04-14T03:13:49.124Z",
        "_id": "6257916de032034d3f10dffe",
        "createdAt": "2022-04-14T03:13:49.162Z",
        "updatedAt": "2022-04-14T03:13:49.162Z",
        "__v": 0
    }
}
```
## UPDATE STATUS OF DEVICE
``` json
POST http://localhost:5000/device/toggle
{
    "id": 452,
    "status": false
}
```
Note: When expected status is false/true and that device's status also false/true, then status of header response is `304 Not Modified` and no body data send to client.

Example response:
```json
{
    "status": 200,
    "data": {
        "_id": "6257916de032034d3f10dffe",
        "id": 452,
        "name": "new device",
        "status": false,
        "type": "led",
        "roomId": 322348042434,
        "capacity": 36,
        "duration": 0,
        "lastUse": "2022-04-14T03:13:49.124Z",
        "createdAt": "2022-04-14T03:13:49.162Z",
        "updatedAt": "2022-04-14T03:58:33.313Z",
        "__v": 0
    }
}
```
## GET FEED DATA FROM ADAFRUIT (Hardware)
```
GET http://localhost:5000/adafruit/hardware/all
```
Example response:
```json
{
    "data": [
        {
            "id": "0EZVMZ3Y98V0G6561HNSD8CNCT",
            "value": "{\"id\":-1,\"cmd\":\"info\",\"name\":\"TempHumi\",\"paras\":\"{31.00,75.00}\"}",
            "feed_id": 1846209,
            "feed_key": "ttda-cnpm-ha2so",
            "created_at": "2022-04-01T08:15:43Z",
            "created_epoch": 1648800943,
            "expiration": "2022-05-01T08:15:43Z"
        },
        {
            "id": "0EZVMX3S0RCJF948627TTSMH8J",
            "value": "{\"id\":-1,\"cmd\":\"info\",\"name\":\"TempHumi\",\"paras\":\"{32.00,71.00}\"}",
            "feed_id": 1846209,
            "feed_key": "ttda-cnpm-ha2so",
            "created_at": "2022-04-01T08:12:12Z",
            "created_epoch": 1648800732,
            "expiration": "2022-05-01T08:12:12Z"
        },
        {
            "id": "0EZVMW9NXEXQJDWY3VB5G2TA91",
            "value": "{\"id\":-1,\"cmd\":\"info\",\"name\":\"TempHumi\",\"paras\":\"{32.00,71.00}\"}",
            "feed_id": 1846209,
            "feed_key": "ttda-cnpm-ha2so",
            "created_at": "2022-04-01T08:10:47Z",
            "created_epoch": 1648800647,
            "expiration": "2022-05-01T08:10:47Z"
        },
    ]
}
```

## GET ALL PORTS

```
GET http://localhost:5000/port
```
```json
{
    "data": [
        {
            "_id": "625ed5727fb0ca782ba58e40",
            "port": 0,
            "status": false,
            "createdAt": "2022-04-19T15:29:54.096Z",
            "updatedAt": "2022-04-19T15:29:54.096Z",
            "__v": 0
        },
        {
            "_id": "625ed5727fb0ca782ba58e42",
            "port": 2,
            "status": false,
            "createdAt": "2022-04-19T15:29:54.098Z",
            "updatedAt": "2022-04-19T15:29:54.098Z",
            "__v": 0
        },
        {
            "_id": "625ed5727fb0ca782ba58e41",
            "port": 1,
            "status": false,
            "createdAt": "2022-04-19T15:29:54.097Z",
            "updatedAt": "2022-04-19T15:29:54.097Z",
            "__v": 0
        }
    ]
}
```