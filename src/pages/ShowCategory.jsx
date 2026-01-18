
const ShowCategory = ({category, categoryImg}) => {
    // console.log("familia:", family, "familyImg: ", familyImg)
    const image = "https://ftmvjdloxwxyjxanswzk.supabase.co/storage/v1/object/public/miTienda_n/categories/" +categoryImg;
    //console.log("Image url: ", image);

    return (
        <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2">
             <div style={{  height: "13rem", fontSize: "11.2px", backgroundColor: "rgba(0, 0, 0, 0.03)", padding: "12px", marginTop:"3rem"}}>
                    <img 
                        style={{maxHeight: "11rem", maxwidth: "17rem", width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply"}} 
                        src={image} 
                        alt="Category Image" 
                    />
            </div>
            <div style={{height:"3rem", textAlign: "center", alignContent: "center"}}>
                <span>{category}</span>
            </div>

        </div>

    )
}

export default ShowCategory

