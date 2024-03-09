export default function Time(item){
    return(
        <>
        <div className="timeLabel">
        {item.time ? (
            <>
            <label>
                {item.time.years > 0 ? (
                <>{item.time.years} years</>
                ):(
                    <>
                    {item.time.months > 0 ? (
                        <>{item.time.months} months</>
                    ) : (
                        <>
                        {item.time.days > 0 ? (
                            <>{item.time.days} days</>
                        ) : (
                            <>
                            {item.time.hours > 0 ? (
                                <>{item.time.hours} hours</>
                            ) : (
                                <>
                                {item.time.minutes > 0 ? (
                                    <>{item.time.minutes} minutes</>
                                ) : (
                                    <>
                                    {item.time.seconds > 0 && (
                                        <>{item.time.seconds} seconds</>
                                    )}
                                    </>
                                )}
                                </>
                            )}
                            </>
                        )}
                        </>
                    )}
                    </>
                )}
                <label> ago</label>
            </label>
        </>
        ) :(<></>)}
        </div>
        </>
    )
}