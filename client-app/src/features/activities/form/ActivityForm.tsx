import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid"
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyTDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loadActivity, loadingInitial } = activityStore
    const { id } = useParams();
    const navigate = useNavigate();


    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues)

    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity frscription is required"),
        category: Yup.string().required(),
        date: Yup.string().required("Date is required"),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity])

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea placeholder='Description' rows={3} name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyTDateInput
                            name='date'
                            placeholderText="Date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color="teal" />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button
                            loading={isSubmitting}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit'
                            disabled={isSubmitting || !dirty || !isValid}
                        />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
}
)