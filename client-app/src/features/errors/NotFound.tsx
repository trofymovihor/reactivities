import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon='search' />
            Oops, we've looked everywhere but could not find what you are looking for
            <Segment.Inline>
                <Button as={Link} to='/activities' >
                    Return to Activities Page
                </Button>
            </Segment.Inline>
        </Segment>
    )
}