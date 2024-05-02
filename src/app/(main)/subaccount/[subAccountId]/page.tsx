import React from 'react'

type Props = {
    params:{subAccountId:string}
}

const SubAccountIdPage = ({params}: Props) => {
  return (
      <div>
        SubAccountId:  {params?.subAccountId}
    </div>
  )
}

export default SubAccountIdPage