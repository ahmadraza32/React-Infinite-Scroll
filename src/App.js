import React from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import useBookSearch from './useBookSearch'

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setpageNumber] = useState(1)
  const {loading, error, hasmore, books} = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookEl = useCallback((node) => {
    if(loading) return

    if(observer.current) observer.current.disconnect()
    console.log(node);

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasmore){
        console.log('visible');
        setpageNumber(prev => prev + 1)
      }
    })
  }, [loading, hasmore])

  function handlechange(e){
    setQuery(e.target.value)
    setpageNumber(1)
  }

  return (
    <div>
      <input type="text" value={query} onChange={handlechange} />
      <div>
        {
          books.map((book, index) => {
            if(books.length === index + 1){
              return <div ref={lastBookEl} key={index}>{book} </div>
            }
            else{
              return <div key={index}>{book} </div>
            }
          })
        }
      </div>
      <div>{ loading && 'loading'} </div>
      <div>{error && 'error' } </div>
    </div>
  )
}

export default App