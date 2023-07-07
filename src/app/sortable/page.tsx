'use client'
import { Table, useAsyncList, useCollator } from "@nextui-org/react"
import './sortable.css'

export default function App() {
  const collator = useCollator({ numeric: true })

  async function load({ signal }:any ) {
   const res = await fetch("https://swapi.py4e.com/api/people/?search", {signal})
    const json = await res.json()
    return {
      items: json.results,
    }
  }
  async function sort({ items, sortDescriptor }:any) {
    return {
      items: items.sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
        let first = a[sortDescriptor.column]
        let second = b[sortDescriptor.column]
        let cmp = collator.compare(first, second)
        if (sortDescriptor.direction === "descending") {
          cmp *= -1
        }
        return cmp
      }),
    }
  }
  const list = useAsyncList({ load, sort })
  return (
    <Table
      aria-label="Example static collection table"
      css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <Table.Header>
        <Table.Column key="name" allowsSorting>
          Name
        </Table.Column>
        <Table.Column key="height" allowsSorting>
          Height
        </Table.Column>
        <Table.Column key="mass" allowsSorting>
          Mass
        </Table.Column>
        <Table.Column key="birth_year" allowsSorting>
          Birth Year
        </Table.Column>
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState}>
        {(item:any) => (
          <Table.Row key={item.name}>
            {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}