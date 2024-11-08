import ErrorBanner from "../components/ErrorBanner";

export default function Error() {

    const errorData = {
        title: "404 - Not found",
        content: "The page you are looking for cannot be found",
        destination: "/",
        buttonLabel: "Back home"
    };

    return (
        <div>
            <ErrorBanner data={errorData} />
        </div>
    )
}