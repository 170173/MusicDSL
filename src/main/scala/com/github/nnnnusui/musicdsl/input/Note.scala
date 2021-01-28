package com.github.nnnnusui.musicdsl.input

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import com.github.nnnnusui.musicdsl.router.FlexibleDefaultJsonProtocol

sealed trait Note
object Note {
  case class Create(offset: Int, octave: Int, pitch: Int, length: Int, childRollId: Option[Int]) extends Note
  case class GetAll() extends Note
  case class Delete(rollId: Int, id: Int) extends Note
  trait JsonSupport extends SprayJsonSupport with FlexibleDefaultJsonProtocol {
    implicit val createInput = jsonFormat5(Create)
    implicit val deleteInput = jsonFormat2(Delete)
  }
}
