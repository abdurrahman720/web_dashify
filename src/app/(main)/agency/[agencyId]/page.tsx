import React from 'react'

type Props = {
    params: {
        agencyId: string
    }
}

const Page = ({params}: Props) => {
  return (
      <div>
          {params.agencyId}
    </div>
  )
}

export default Page