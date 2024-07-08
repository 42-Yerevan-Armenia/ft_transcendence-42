class get42Config{
    Get42Connect = async () => {
        window.location.href = `${INTRA_API_URL}/oauth/authorize?client_id=${INTRA_API_UID}&redirect_uri=${INTRA_REDIRECT_URI}&response_type=code`
    }
}
