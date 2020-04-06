let id = 0

/**
 * get primary key
 * @returns {number}
 */
const getNextId = () => {
    return id++
}
/**
 * object Construction
 * @param name
 * @param age
 * @param sex
 * @constructor
 */
const Person = function (name, age, sex) {
    this.id = getNextId()
    this.name = name
    this.age = age
    this.sex = sex
}

const persons = [
    new Person('Jack', 25, 'man'),
    new Person('Jim', 25, 'women'),
    new Person('Mark', 25, 'man'),
    new Person('Walker', 25, 'man'),
]

module.exports = {
    /**
     * return all person
     * @returns {[*, *, *, *]}
     */
    findAllPerson: () => {
        return persons
    },

    /**
     * find one Person width id
     * @param id
     * @returns {null}
     */
    findOne: (id) => {
        const curPerson = persons.filter((item) => item.id === id)
        return curPerson && curPerson.length ? curPerson[0] : null
    },

    /**
     * creat one Person  example
     * @param name
     * @param age
     * @param sex
     * @returns {Person}
     */
    createOne: (name, age, sex) => {
        const targetPer = new Person(name, age, sex)
        persons.push(targetPer)
        return targetPer
    },

    /**
     * return remove obj
     * @param id
     * @returns {null|*}
     */
    deletePerson: (id) => {
        let index = -1
        persons.forEach((item, idx) => {
            if (item.id === id && index < 0) {
                index = idx
            }
        })
        if (index >= 0) {
            return persons.splice(index, 1)[0]
        }
        return null
    }
}
