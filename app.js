//jshint esversion:6

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {
    BMI: '(calculate)',
    categoryBMI: '(calculate)',
    weightInKg: '(calculate)',
    idealWeight: '(calculate)',
    weightToLose: '(calculate)',
    loseOrGainTxt: 'lose/gain',
    dailyCalories: '(calculate)',
    increaseOrDecreaseTxt: 'increase/decrease',
    weeksOnDiet: '(calculate)',
    dietCalories: '(calculate)',
  })
})

app.post('/', function (req, res) {
  //Informations from the form
  const gender = req.body.gender
  const exercise = req.body.exercise
  const age = req.body.age
  const weightInKg = req.body.weight
  const heightInM = req.body.height / 100

  // BMI results
  const BMI = (weightInKg / heightInM ** 2).toFixed(1)

  let categoryBMI = ''

  if (BMI < 18.5) {
    categoryBMI = 'Underweight'
  } else if (BMI < 25) {
    categoryBMI = 'Normal'
  } else if (BMI < 30) {
    categoryBMI = 'Overweight'
  } else if (BMI < 35) {
    categoryBMI = 'Obese'
  } else {
    categoryBMI = 'Extremely Obese'
  }

  //Logic calculations
  const idealWeight = Math.round(22.5 * heightInM * heightInM)

  let BMR
  if (gender === 'male') {
    BMR = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age + 50
  } else if (gender === 'female') {
    BMR = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age - 150
  }

  let dailyCalories
  if (exercise === 'none') {
    dailyCalories = Math.round(BMR * 1.4)
  } else if (exercise === 'moderate') {
    dailyCalories = Math.round(BMR * 1.5)
  } else if (exercise === 'daily') {
    dailyCalories = Math.round(BMR * 1.6)
  }

  const weightToLose = weightInKg - idealWeight
  const weightToLoseNoSign = Math.abs(weightInKg - idealWeight)
  const weeksOnDiet = Math.abs(weightToLose / 0.5)

  let loseOrGainTxt
  let increaseOrDecreaseTxt
  let dietCalories
  if (weightToLose < 0) {
    dietCalories = dailyCalories + 500
    loseOrGainTxt = 'gain'
    increaseOrDecreaseTxt = 'increase'
  } else {
    dietCalories = dailyCalories - 500
    loseOrGainTxt = 'lose'
    increaseOrDecreaseTxt = 'decrease'
  }

  //response page
  res.render('index', {
    BMI: BMI,
    categoryBMI: categoryBMI,
    weightInKg: weightInKg,
    idealWeight: idealWeight,
    weightToLose: weightToLoseNoSign,
    loseOrGainTxt: loseOrGainTxt,
    dailyCalories: dailyCalories,
    increaseOrDecreaseTxt: increaseOrDecreaseTxt,
    weeksOnDiet: weeksOnDiet,
    dietCalories: dietCalories,
  })
})

let port = process.env.PORT
if (port == null || port == '') {
  port = 8000
}
app.listen(port, function () {
  console.log('Server has started successfully!')
})
