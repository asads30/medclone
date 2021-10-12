<template>
    <div>
        {{ message }}
    </div>
</template>

<script>
export default {
    name: 'McvErrorMessage',
    props: {
        message: {
            type: String,
            required: true,
            default: 'Something went wrong'
        }
    }
}
</script>