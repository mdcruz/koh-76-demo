import { chromium } from 'k6/experimental/browser'
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'

import { AdminPanel } from '../pages/admin-panel.js'
import { Homepage } from '../pages/homepage.js'
import { bookingData } from '../data/booking-data.js'
import { testSetup } from './setup.js'

export function setup() {
  testSetup()
}

export default async function () {
  const browser = chromium.launch({
    headless: false,
    slowMo: '500ms'
  })
  const context = browser.newContext()
  const page = context.newPage()

  const { name, email, contactNumber, subject } = bookingData

  try {
    const homepage = new Homepage(page)
    await homepage.goto()
    await homepage.submitForm()

    expect(homepage.getVerificationMessage()).to.contain(name)

    const adminPanel = new AdminPanel(page)
    await adminPanel.login()
    await adminPanel.openMessage()

    const actualMessage = adminPanel.getMessage()

    expect(actualMessage).to.contain(name)
    expect(actualMessage).to.contain(email)
  } finally {
    page.close()
    browser.close()
  }
}