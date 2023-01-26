import { chromium } from 'k6/x/browser'
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'

import { AdminPanel } from '../pages/admin-panel.js'
import { Homepage } from '../pages/homepage.js'
import { bookingData } from '../data/booking-data.js'
import { testSetup } from './setup.js'

export function setup() {
  testSetup()
}

export default async function () {
  const browser = chromium.launch({ headless: false })
  const context = browser.newContext()
  const page = context.newPage()

  const { name, email, contactNumber, subject } = bookingData

  try {
    const homepage = new Homepage(page)
    await homepage.goto()
    homepage.submitForm()

    expect(homepage.getVerificationMessage()).to.contain(name)

    const adminPanel = new AdminPanel(page)
    adminPanel.login()
    adminPanel.openMessage()

    const actualMessage = adminPanel.getMessage()

    expect(actualMessage).to.contain(name)
    expect(actualMessage).to.contain(email)
    expect(actualMessage).to.contain(contactNumber)
    expect(actualMessage).to.contain(subject)
  } finally {
    page.close()
    browser.close()
  }
}