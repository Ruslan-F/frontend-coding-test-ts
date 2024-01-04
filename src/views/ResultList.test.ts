/* eslint-disable import/no-extraneous-dependencies */
import { fireEvent, render } from '@testing-library/vue'
import ResultList from './ResultList.vue'

test('has title', async () => {
  const { getByText } = render(ResultList)

  getByText(`Here's GraphQL API demo`)
})

test('has no initial countries', async () => {
  const { container } = render(ResultList)
  const tds = container.querySelectorAll('td')
  expect(tds.length === 0)
})

test('loads countries after some time', async () => {
  const { container } = render(ResultList)

  await new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

  const tds = container.querySelectorAll('td')
  expect(tds.length).greaterThan(0)
})

test('clear filters button is initially disabled', async () => {
  const { getByTestId } = render(ResultList)

  const button = getByTestId('button-clear')

  expect(button).property('disabled')
})

test('clear filters button is enabled after filter input', async () => {
  const { getByTestId } = render(ResultList)

  const input = getByTestId('input-iso')
  const button: HTMLButtonElement = getByTestId('button-clear')

  expect(button.classList.contains('disabled')).toBe(true)

  await fireEvent.update(input, 'UA')

  expect(button.classList.contains('disabled')).toBe(false)
})
