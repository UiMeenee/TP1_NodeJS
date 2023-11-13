# TP1_NodeJS

## Samples 
Post Event : http://localhost:3000/events
```{
    "name": "oui",
    "date": "2024-04-23T18:25:43.511Z",
    "duration": 30,
    "participants": [],
    "waitingList": []
}
```

Add participant : http://localhost:3000/events/addParticipant
```
{
    "eventId": "655271ad82cc2822bbdb69e9",
    "participant": {
        "name": "r",
        "age": 30
    }
}
```

Remove participant : http://localhost:3000/event/removeParticipant
```
{
    "eventId": "655271ad82cc2822bbdb69e9",
    "name": "r"
}
```

Get event by Id : http://localhost:3000/events/655271ad82cc2822bbdb69e9

Delete : http://localhost:3000/events/655271ad82cc2822bbdb69e9

Get all : http://localhost:3000/events