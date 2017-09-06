import { suite, test} from "mocha-typescript";
import * as assert from "assert";
import {Table} from "../../../src/domain/Table/Table";
import * as sinon from "sinon";
import {SinonFakeTimers} from "sinon";
import {TableId} from "../../../src/domain/Table/TableId";

@suite
export class TableTest {

    private clock: SinonFakeTimers;
    private mockNowDate: Date;

    before() {
        this.mockNowDate = new Date("2017-05-17T00:00:00+00:00");
        this.clock = sinon.useFakeTimers(this.mockNowDate.getTime());
    };

    after() {
        this.clock.restore();
    };

    @test "release should change status and updated at"() {
        let isFree = false;
        let updatedAt = new Date(12345);
        let table = new Table(new TableId("foo"), "", isFree, updatedAt);
        table.release();
        assert.equal(table.getIsFree(), true);
        assert.equal(table.getUpdatedAt().getTime(), this.mockNowDate.getTime());
    }

    @test "book should change status and updated at"() {
        let isFree = true;
        let updatedAt = new Date(12345);
        let table = new Table(new TableId("foo"), "", isFree, updatedAt);
        table.book();
        assert.equal(table.getIsFree(), false);
        assert.equal(table.getUpdatedAt().getTime(), this.mockNowDate.getTime());
    }
}
