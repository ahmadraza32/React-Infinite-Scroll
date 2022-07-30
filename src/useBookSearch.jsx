import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

function useBookSearch(query, pageNumber) {
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState(false)
    const [hasmore, sethasmore] = useState(false)
    const [books, setBooks] = useState([])

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setloading(true)
        seterror(false)
        let cancel

        axios({
            method: 'get', url: 'http://openlibrary.org/search.json', params: {q: query, page: pageNumber},
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
        .then(res => {
            console.log(res.data);
            setBooks(prev => {
                return [...new Set([...prev, ...res.data.docs.map(b => b.title)])]
            })
            setloading(false)
            sethasmore(res.data.length > 0)
        })
        .catch(e => {
            if(axios.isCancel(e)) return
            seterror(true)
        })
    }, [query, pageNumber])

  return {loading, error, hasmore, books}
}

export default useBookSearch