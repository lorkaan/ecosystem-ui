<script setup lang="ts">

import { HiddenControl } from "@ecosystem/core-ui";
import { DeadlinePage } from "@ecosystem/calendar";
import { FormPage } from "@ecosystem/dynamicforms";

</script>
<template>
    <HiddenControl>
        <template #toggleable>
            <FormPage formTypeCode="deadline"/>
        </template>
        <template #always>
            <DeadlinePage />
        </template>
    </HiddenControl>
</template>