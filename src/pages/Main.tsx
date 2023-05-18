import Header from "../components/Header/Header";
import RecipeLIst from "../components/RecipeList/RecipeLIst";
const Main = () => {
    return (
        <div>
            <div className="container">
                <Header/>
                <RecipeLIst url={'dishes'}/>
            </div>
        </div>
    )
}

export default Main;