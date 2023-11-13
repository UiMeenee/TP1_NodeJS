let waitingList = []

const notifyIfModified = (event) => {
    console.log(`Event ${event.name} has been modified for : ${event.participants.forEach(p => p.name)}`)
}

const createEvent = (name, date, duration) => {
    var participants = []
    var event = {
        name,
        date,
        duration,
        participants
    }
    if (date < new Date()) {
        throw new Error('Cannot create event in the past')
    }
    if (duration < 0) {
        throw new Error('Cannot create event with negative duration')
    }

    return event
}

const addParticipant = (participant, event) => {
    if (event.date < new Date()) {
        throw new Error('Cannot add participant to past event')
    }
    if (event.participants.length >= 10) {
        waitingList.push(participant)
        throw new Error('Cannot add more than 10 participants')
    }
    if (event.participants.find(p => p.name === participant.name)) {
        throw new Error('Cannot add participant twice')
    }
    event.participants.push(participant)
    notifyIfModified(event)
}

const removeParticipant = (participant, event) => {
    if (event.date < new Date()) {
        throw new Error('Cannot remove participant from past event')
    }
    if (!event.participants.find(p => p.name === participant.name)) {
        throw new Error('Cannot remove participant not in event')
    }
    event.participants = event.participants.filter(p => p.name !== participant.name)
    event.participants.push(waitingList.shift())
    notifyIfModified(event)
}

const deleteEvent = (event) => {
    if (event.date < new Date()) {
        throw new Error('Cannot delete past event')
    }
    event.Destroy();
    notifyIfModified(event)
}